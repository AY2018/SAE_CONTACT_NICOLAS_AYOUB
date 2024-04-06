<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
// use Symfony\Component\Routing\Annotation\Route;
use App\Entity\Contact;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;

class ContactController extends AbstractController
{

    // --------------Liste de tous les contacts----------------


    public function contactsList($id, ManagerRegistry $doctrine): JsonResponse
    {
        $em = $doctrine->getManager();
        $repository = $em->getRepository(Contact::class);

        // Find contacts by user_id
        $contacts = $repository->findBy(['user' => $id]);

        $contactsData = [];
        foreach ($contacts as $contact) {
            $contactsData[] = [
                'id' => $contact->getId(),
                'name' => $contact->getName(),
                'surname' => $contact->getSurname(),
                'phone' => $contact->getPhone(),
                'email' => $contact->getEmail(),
                'address' => $contact->getAddress(),
                'other' => $contact->getOther(),
                'image' => $contact->getImage(),
            ];
        }

        $response = new JsonResponse($contactsData);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        return $response;
    }
    public function index(ManagerRegistry $doctrine, int $id): JsonResponse
    {

        $em = $doctrine->getManager();
        $repository = $em->getRepository(Contact::class);
        $contact = $repository->find($id);

        if (!$contact) {
            return new JsonResponse(['error' => 'Contact not found'], 404);
        }

        $contactData = [
            'id' => $contact->getId(),
            'name' => $contact->getName(),
            'surname' => $contact->getSurname(),
            'phone' => $contact->getPhone(),
            'email' => $contact->getEmail(),
            'address' => $contact->getAddress(),
            'other' => $contact->getOther(),
            'imagePath' => $contact->getImage(),
        ];

        $response = new JsonResponse($contactData);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        return $response;
    }


    // --------------Créer un nouveau contact----------------

    public function createContact(Request $request, ManagerRegistry $doctrine, SluggerInterface $slugger): JsonResponse
    {
        $data = $request->request->all();

        // Create a new contact entity
        $contact = new Contact();
        $contact->setName($data['name']);
        $contact->setSurname($data['surname'] ?? null);
        $contact->setPhone($data['phone']);
        $contact->setEmail($data['email'] ?? null);
        $contact->setAddress($data['address'] ?? null);
        $contact->setOther($data['other'] ?? null);

        // Ajouter l'user_id
        $userId = $data['user_id'] ?? null;
        if (!$userId) {
            return new JsonResponse(['error' => 'User ID is required'], 400);
        }

        // Récupérer l'utilisateur correspondant à l'ID et l'associer au contact
        $em = $doctrine->getManager();
        $user = $em->getRepository(User::class)->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        } else {
            $contact->setUser($user);
        }

        // Gérer le téléchargement setUserage
        $imageFile = $request->files->get('image');
        if ($imageFile) {
            $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

            try {
                $imageFile->move(
                    $this->getParameter('images_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error uploading image'], 500);
            }

            $contact->setImage($newFilename);
        } else {
            $contact->setImage('pp.jpg');
        }

        $entityManager = $doctrine->getManager();
        $entityManager->persist($contact);
        $entityManager->flush();

        $response = new JsonResponse(['message' => 'Contact created successfully'], 201);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        return $response;
    }


    // --------------Modifier un contact----------------

    public function editContact(
        Request $request,
        SluggerInterface $slugger,
        int $id,
        ManagerRegistry $doctrine
    ): JsonResponse {

        // Ajouter un log pour voir le contenu de la requête
        $em = $doctrine->getManager();
        $contact = $em->getRepository(Contact::class)->find($id);

        if (!$contact) {
            return new JsonResponse(['error' => 'Contact not found'], 404);
        }

        // Traiter les données JSON
        $data = json_decode($request->getContent(), true);

        // Traiter les données FormData
        $formData = $request->request->all();

        // Mettre à jour les données du contact à partir des données JSON
        $contact->setName($data['name'] ?? $contact->getName());
        $contact->setSurname($data['surname'] ?? $contact->getSurname());
        $contact->setPhone($data['phone'] ?? $contact->getPhone());
        $contact->setEmail($data['email'] ?? $contact->getEmail());
        $contact->setAddress($data['address'] ?? $contact->getAddress());
        $contact->setOther($data['other'] ?? $contact->getOther());

        // Mettre à jour l'image du contact à partir des données FormData
        $imageFile = $request->files->get('image');
        if ($imageFile) {
            $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

            try {
                $imageFile->move(
                    $this->getParameter('images_directory'),
                    $newFilename
                );
            } catch (FileException $e) {
                return new JsonResponse(['error' => 'Error uploading image'], 500);
            }

            $contact->setImage($newFilename); // Assuming your entity has a setImageFilename method
        }

        $em->flush();

        return new JsonResponse(['message' => 'Contact updated successfully']);
    }



    // --------------Supprimer un contact----------------

    public function deleteContact(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $em = $doctrine->getManager();
        $repository = $em->getRepository(Contact::class);
        $contact = $repository->find($id);

        if (!$contact) {
            return new JsonResponse(['error' => 'Contact not found'], 404);
        }

        $em->remove($contact);
        $em->flush();

        $response = new JsonResponse(['message' => 'Contact deleted successfully']);
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
        return $response;
    }
}
