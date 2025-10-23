pipeline {
    agent any

    environment {
        BACKEND_URL = credentials('BACKEND_URL')
        PORT = '3000'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/PreVya/express-frontend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }

        stage('Set Environment') {
            steps {
                sh """
                echo BACKEND_URL=${BACKEND_URL} > .env
                echo PORT=${PORT} >> .env
                """
            }
        }

        stage('Restart Express App') {
            steps {
                sh """
                pkill -f 'index.js' || true
                nohup npm start > express.log 2>&1 &
                """
            }
        }
    }
}
