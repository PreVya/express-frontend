pipeline {
    agent any

    environment {
        CONTAINER_NAME = 'express-frontend'
        IMAGE_NAME = 'express-frontend'
        BACKEND_URL = credentials('BACKEND_URL')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/PreVya/express-frontend.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                if [ $(docker ps -q -f name=express-frontend) ]; then
                    echo "Stopping old container..."
                    docker stop express-frontend && docker rm express-frontend
                fi
                '''
            }
        }

        stage('Run New Container') {
            steps {
                sh '''
                echo "Starting new frontend container..."
                docker run -d --name express-frontend \
                -e BACKEND_URL="$BACKEND_URL" \
                -p 3000:3000 \
                express-frontend:latest
                '''
            }
        }
    }

    post {
        success {
            echo 'Express frontend successfully built and deployed locally.'
        }
        failure {
            echo 'Deployment failed. Check Jenkins logs.'
        }
    }
}