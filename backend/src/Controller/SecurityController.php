<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class SecurityController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Récupérer les données du formulaire
        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            return new JsonResponse(['error' => 'Informations incorrectes'], 400);
        }

        // Vérifier les identifiants dans la base de données
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['error' => 'Informations incorrectes'], 400);
        }

        // Vérifier si le mot de passe est correct en utilisant password_verify()
        if (!password_verify($password, $user->getPassword())) {
            return new JsonResponse(['error' => 'Informations incorrectes'], 400);
        }

        // Démarrer une session Symfony
        $session = $request->getSession();
        $session->set('user_id', $user->getId());
        $session->set('user_email', $user->getEmail());
        $session->set('user_roles', $user->getRoles());

        // Préparer les données de l'utilisateur à retourner
        $userData = [
            'id' => $session->get('user_id'),
            'email' => $session->get('user_email'),
            'roles' => $session->get('user_roles'),
        ];

        // Réponse JSON pour indiquer que la connexion a réussi et renvoyer les données de l'utilisateur
        return new JsonResponse(['message' => 'Login successful.', 'user' => $userData]);
    }


    public function register(Request $request): JsonResponse
    {
        // Récupérer les données du formulaire
        $data = json_decode($request->getContent(), true);

        // Vérifier si les données sont valides
        if (empty($data['email']) || empty($data['password'])) {
            return new JsonResponse(['error' => 'Name and password are required.'], 400);
        }

        // Vérifier si l'utilisateur existe déjà
        $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return new JsonResponse(['error' => 'User with this email already exists.'], 400);
        }

        // Créer un nouvel utilisateur
        $user = new User();
        $user->setEmail($data['email']);

        // Hasher le mot de passe avant de le stocker
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        $user->setPassword($hashedPassword);

        $user->setRoles(['ROLE_USER']);

        // Enregistrer l'utilisateur en base de données
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        // Démarrer une session Symfony
        $session = $request->getSession();
        $session->set('user_id', $user->getId());
        $session->set('user_email', $user->getEmail());
        $session->set('user_roles', $user->getRoles());

        // Préparer les données de l'utilisateur à retourner
        $userData = [
            'id' => $session->get('user_id'),
            'email' => $session->get('user_email'),
            'roles' => $session->get('user_roles'),
        ];

        // Réponse JSON pour indiquer que la connexion a réussi et renvoyer les données de l'utilisateur
        return new JsonResponse(['message' => 'User registered successfully.', 'user' => $userData], 201);
    }

    public function logout(Request $request): JsonResponse
    {
        // Terminer la session Symfony
        $session = $request->getSession();
        $session->invalidate();

        // Réponse JSON pour indiquer que la déconnexion a réussi
        return new JsonResponse(['message' => 'Logout successful.']);
    }

    // verif si l'utilisateur est connecté
    public function verifSession(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $userId = $session->get('user_id');
        $userName = $session->get('user_name');
        $userRoles = $session->get('user_roles');

        if (!$userId || !$userName || !$userRoles) {
            return new JsonResponse(['error' => 'User not logged in.'], 401);
        }

        $userData = [
            'id' => $userId,
            'email' => $userName,
            'roles' => $userRoles,
        ];

        return new JsonResponse(['message' => 'User logged in.', 'user' => $userData]);
    }
}
