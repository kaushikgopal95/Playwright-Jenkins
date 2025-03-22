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
                    // Get the container ID for the tests service and save it to a file
                    bat 'docker-compose ps -q tests > container_id.txt'
                    
                    // Read the container ID from the file
                    bat 'set /p CONTAINER_ID=<container_id.txt'
                    
                    // Echo the container ID for verification
                    bat 'echo Container ID: %CONTAINER_ID%'
                    
                    // Try to copy the reports using the container ID
                    bat '''
                        if defined CONTAINER_ID (
                            docker cp %CONTAINER_ID%:/app/playwright-report . || echo Failed to copy from /app/playwright-report
                            
                            if not exist playwright-report\\*.* (
                                echo Trying alternative path
                                docker cp %CONTAINER_ID%:/playwright-report . || echo Failed to copy from /playwright-report
                            )
                        ) else (
                            echo No container ID found for tests service
                        )
                    '''
                }
                
                // List what we found (if anything)
                bat 'dir playwright-report || echo No reports directory found'
                
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