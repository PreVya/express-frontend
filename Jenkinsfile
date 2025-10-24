// pipeline {
//     agent any

//     environment {
//         BACKEND_URL = credentials('BACKEND_URL')
//         PORT = '3000'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 git branch: 'main', url: 'https://github.com/PreVya/express-frontend.git'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 sh "npm install"
//             }
//         }

//         stage('Set Environment') {
//             steps {
//                 sh """
//                 echo BACKEND_URL=${BACKEND_URL} > .env
//                 echo PORT=${PORT} >> .env
//                 """
//             }
//         }

//         stage('Restart Express App') {
//             steps {
//                 sh """
//                 pkill -f 'index.js' || true
//                 nohup npm start > express.log 2>&1 &
//                 """
//             }
//         }
//     }
// }




pipeline {
    agent any

    environment {
        CONTAINER_NAME = 'express-frontend'
        IMAGE_NAME = 'your-dockerhub-username/express-frontend'
        BACKEND_URL = credentials('BACKEND_URL')  // for API calls
        DOCKER_NAME = credentials('DOCKER_NAME')
        DOCKER_PASS = credentials('DOCKER_PASS')
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/yourusername/express-frontend-repo.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:latest .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_NAME --password-stdin'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push $IMAGE_NAME:latest'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
                    echo "Stopping old container..."
                    docker stop $CONTAINER_NAME && docker rm $CONTAINER_NAME
                fi
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                echo "Starting new frontend container..."
                docker run -d --name $CONTAINER_NAME \
                -e BACKEND_URL=$BACKEND_URL \
                -p 3000:3000 \
                $IMAGE_NAME:latest
                """
            }
        }
    }

    post {
        success {
            echo '✅ Express frontend successfully built, pushed, and deployed.'
        }
        failure {
            echo '❌ Deployment failed. Check Jenkins logs.'
        }
    }
}
