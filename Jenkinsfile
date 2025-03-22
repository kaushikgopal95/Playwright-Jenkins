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
                
                script {
                    // Get the current directory name for the project name prefix
                    def projectDir = bat(script: '@echo %CD%', returnStdout: true).trim()
                    def projectName = projectDir.tokenize('\\').last().replaceAll(' ', '').toLowerCase()
                    echo "Project directory: ${projectDir}"
                    echo "Project name: ${projectName}"
                    
                    // List all containers to see what's available
                    bat 'docker ps -a'
                    
                    // Try to get the container ID using docker-compose
                    def containerId = bat(script: '@docker-compose ps -a -q tests', returnStdout: true).trim()
                    echo "Container ID from docker-compose: ${containerId}"
                    
                    if (containerId) {
                        echo "Attempting to copy reports from container ID: ${containerId}"
                        bat "docker cp ${containerId}:/app/playwright-report . || echo Failed to copy reports, continuing anyway"
                    } else {
                        echo "No container found with the service name 'tests'. Trying to find it by pattern..."
                        
                        // Try to find the container by a likely name pattern
                        def containerByPattern = bat(script: '@docker ps -a --filter name=${projectName}_tests -q', returnStdout: true).trim()
                        echo "Container by pattern: ${containerByPattern}"
                        
                        if (containerByPattern) {
                            echo "Found container by pattern: ${containerByPattern}"
                            bat "docker cp ${containerByPattern}:/app/playwright-report . || echo Failed to copy reports, continuing anyway"
                        } else {
                            echo "Could not find tests container. No reports will be collected."
                        }
                    }
                }
                
                // Archive the reports as artifacts (if they exist)
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