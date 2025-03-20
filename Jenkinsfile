pipeline {
    agent any
    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main', credentialsId: 'git', url: 'git@github.com:kaushikgopal95/Playwright-Jenkins.git'
            }
        }
        stage('Install Dependencies and Run Tests') {
            steps {
                sh '''
                # Build and run tests using docker-compose
                docker-compose build tests
                docker-compose run --rm tests
                '''
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                sh 'docker-compose up -d --build app db'
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