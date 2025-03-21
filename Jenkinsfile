pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git', url: 'git@github.com:kaushikgopal95/Playwright-Jenkins.git'
            }
        }
        stage('Build and Test') {
            steps {
                // Build and start the app container
                sh 'docker-compose up -d app'
                
                // Build and run tests against the running app
                sh 'docker-compose build tests'
                sh 'docker-compose run --rm tests'
            }
        }
    }
    post {
        always {
            // Clean up - stop all containers
            sh 'docker-compose down'
            cleanWs()
        }
    }
}