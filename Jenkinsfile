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
                // sh 'sleep 10'
                // Build and run tests against the running app
                bat 'docker-compose build tests'
                bat 'set | findstr /i url'
                bat 'echo %APP_URL%' 
                bat 'docker-compose run --rm tests'
            }
        }

        stage('Collect Test Reports') {
            steps {
                // Create directory for reports if it doesn't exist
                bat 'if not exist playwright-report mkdir playwright-report'
                
                // Use script block to capture container ID and use it in subsequent commands
                script {
                    // Get container ID using returnStdout and store it in a variable
                    def containerId = bat(script: '@docker-compose ps -q tests', returnStdout: true).trim()
                    echo "Container ID: ${containerId}"
                    
                    // Use the captured container ID for the docker cp command
                    if (containerId) {
                        bat "docker cp ${containerId}:/app/playwright-report . || echo Failed to copy reports, container may be stopped"
                    } else {
                        error "Failed to get container ID"
                    }
                }
                
                // Archive the reports as artifacts
                archiveArtifacts artifacts: 'playwright-report/**/*', fingerprint: true, allowEmptyArchive: true
            }
        }

    }
    post {
        always {
            // Clean up - stop all containers
            bat 'docker-compose down || true'
            cleanWs()
        }
    }
}