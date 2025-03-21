pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git', url: 'git@github.com:kaushikgopal95/Playwright-Jenkins.git'
            }
        }

        stage('Check Docker') {
            steps {
                bat 'docker --version || (echo "Docker not available" && exit 1)'
                bat 'docker-compose --version || (echo "Docker Compose not available" && exit 1)'
                bat 'docker info || (echo "Docker daemon not running" && exit 1)'
            }
        }   

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t automation:0.1 .'
                // Optionally tag with 'latest' as well
                bat 'docker tag automation:0.1 automation:latest'
            }
        }

        stage('Build and Test') {
            steps {
                // Build and start the app container
                bat 'docker-compose up -d app'
                sh 'sleep 10'
                // Build and run tests against the running app
                bat 'docker-compose build tests'
                bat 'docker-compose run --rm tests'
            }
        }

    }
    post {
        always {
            // Clean up - stop all containers
            sh 'docker-compose down || true'
            cleanWs()
        }
    }
}