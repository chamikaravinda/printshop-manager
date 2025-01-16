# React-NodeJS-Firebase-Boilerplate

This repository is a boilerplate for a web application using React for the frontend, Node.js for the backend, and Firebase for authentication and database services.


## Prerequisites

- Node.js and npm installed
- Firebase account

## Getting Started

1. **Clone the repository:**
    ```sh
    git clone https://github.com/chamikaravinda/React-NodeJS-Firebase-Boilerplate.git
    cd React-NodeJS-Firebase-Boilerplate
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Set up Firebase:**
    - Go to the Firebase Console and create a new project.
    - Get the json file for the service account (Project setting -> service account )
    - update the /server/index.js file to use the json file

4. **Run the Server:**

    Create the .env file and include the following 
    
    ```
        PORT: 3000
        HOST: localhost
        HOST_URL: http://localhost:3000

    ```

    Then run the server using following command 
    
    ```sh
    cd /server
    npm run dev
    ```

5. **Run the Client:**
    ```sh
    cd /client
    npm run dev
    ```
6. **Run with Docker:**

Run the following cmds to build the frontend and push to dockerhub
'
```
docker build -t chamikaravinda/react-boilerplate-frontend:latest .\client\

docker image push  chamikaravinda/react-boilerplate-frontend:latest
```
Run the following cmds to build the backend and push to dockerhub

```
docker build -t chamikaravinda/node-boilerplate-backend:latest .\server\

docker image push  chamikaravinda/node-boilerplate-backend:latest
```
Run the following cmds to start servers with docker-compose

```
docker-compose pull

docker-compose up
```
## Project Structure

- `/client`: Contains the React frontend code.
- `/server`: Contains the Node.js backend code.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or feedback, please contact chamikaravinda@gmail.com.
