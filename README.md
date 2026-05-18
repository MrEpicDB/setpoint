This is s256948 dissertation project. All the steps to run locally are listed below alongside any relevent information.

## How To Run Locally
Provided the user has Docker installed; Run `docker compose up -d` which will run the docker containers in detached modes.

To visit the application open your browser and go to [http://localhost:3000].

When making changes you will have to run `docker compose up -d --build`, this will up both containers whilst also applying the changes made locally.

# Project Information
This project is made to be a demonstration of the capabilities of a system like this so events and sessions will be fabricated so payments should NOT be payed for these as they are purely for demonstration.

This project has been made with Conventional Commits. If contributing to this project at all the same expectation should be followed. More infromation avaliable at [https://www.conventionalcommits.org/en/v1.0.0/].

# Database Information
To open the database inside a browser either run `npx prisma studio` inside the `/gui` then open [http://localhost:51212].
Since this project uses Prisma to manage the database, when you update the `schema.prisma` file, you will need to run `npx prisma migrate dev --name add-session-model` inside of the `/gui` directory.

To find if the database port being in use run `sudo lsof -i :5432`. Note this ONLY works in WSL or a linux based cmd.

# Rebuild and restart docker compose files
Run `docker compose build --no-cache gui && docker compose up -d gui` which will restart and rebuild the docker compose file.
