# Endpoints for server 

## Categories

- get all categories  get    :"http://localhost:8080/api/v1/categories"

- add category        post   :"http://localhost:8080/api/v1/categories"
the data thet the server expect receve it like :
{
   "name": "category1"
}

- delete category     delete :"http://localhost:8080/api/v1/categories/{id}"

## Suppliers

- get all supplier    get    :"http://localhost:8080/api/v1/supplier"

- add supplier        post   :"http://localhost:8080/api/v1/supplier"
the data thet the server expect receve it like :

{
   "name":"Abo Bilal ",
   "email":"mohammedhamoda823@gmail.com",
   "phone": "+963992221976",
   "counters":"syria",
   "supplierDescription": "supplier1 description"
}

- delete suppliser    delete :"http://localhost:8080/api/v1/supplier/{id}"

## Orders

-get all orders       get    :"http://localhost:8080/api/v1/order"

