pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git', url: 'git@github.com:kaushikgopal95/Playwright-Jenkins.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                if [ -d "node_modules" ]; then
                  echo "Node modules already installed, skipping installation."
                else
                  npm ci
                fi
                '''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                sh 'npx playwright test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                sh 'docker-compose up -d --build'
            }
        }
    }

    post {
        always {
            echo 'Cleaning up workspace...'
            cleanWs()
        }
    }
}
