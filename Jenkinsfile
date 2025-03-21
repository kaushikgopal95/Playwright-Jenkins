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
                sh 'docker --version || (echo "Docker not available" && exit 1)'
                sh 'docker-compose --version || (echo "Docker Compose not available" && exit 1)'
                sh 'docker info || (echo "Docker daemon not running" && exit 1)'
            }
        }

        stage('Build and Test') {
            steps {
                // Build and start the app container
                sh 'docker-compose up -d app'
                sh 'sleep 10'
                // Build and run tests against the running app
                sh 'docker-compose build tests'
                sh 'docker-compose run --rm tests'
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