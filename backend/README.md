# SAE_contactAPP_Back

Parmis les routes disponible, d'abord les l'obtention de données : 

contacts_list:
    path: /contacts
    controller: App\Controller\ContactController::index
    methods: GET

------ Cette route récupère une liste de tous les contacts 

contact_show:
    path: /contacts/{id}
    controller: App\Controller\ContactController::show
    methods: GET

contact_create:
    path: /contacts/new
    controller: App\Controller\ContactController::create
    methods: POST

contact_edit:
    path: /contacts/{id}/edit
    controller: App\Controller\ContactController::edit
    methods: PUT

contact_delete:
    path: /contacts/{id}/delete
    controller: App\Controller\ContactController::delete
    methods: DELETE

