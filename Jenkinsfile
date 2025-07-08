pipeline {
    agent any
    tools {
        nodejs 'NodeJS 20.16.0'
    }
    stages {
        stage('Build') {
            steps {
                echo 'Preparing the dependancy for User Service'
                sh 'chmod 777 .'
                sh "npm install -g yarn"
                sh 'yarn install'
            }
        }
        stage('Copy .env') {
            steps {
                echo 'Creating the environment'
                sh 'rm -rf .env'
                sh 'cp .env.example .env'
            }
        }
        stage('Remove Old Container') {
            steps {
                echo 'Remove old builds'
                sh 'docker stop homerun-user-service'
                sh 'docker rm homerun-user-service'
            }
        }
        stage('Dockerize') {
            steps {
                echo 'Test completed & passed'
                echo 'Creating docker image'
                sh 'docker build -t homerun-user-service .'
            }
        }
        stage('Deploy to Docker') {
            steps {
                echo 'Deploy docker image'
                sh 'docker run -d -p 4001:4001 --name homerun-user-service homerun-user-service:latest'
            }
        }
    }
}