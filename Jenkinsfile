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

        // stage('Build and Test') {
        //     steps {
        //         // Build and start the app container
        //         bat 'docker-compose up -d app'
        //         bat 'docker-compose build tests' 
        //         bat 'docker-compose run tests'
        //         bat 'dir playwright-reports'
        //     }
        // }


        stage('Build and Test') {
            steps {
                // Build and start the app container
                bat 'docker-compose up -d app'
                bat 'docker-compose build tests'
                
                // Add these debugging commands
                bat 'docker-compose run tests ls -la /usr/src/app'
                bat 'docker-compose run tests ls -la /usr/src/app/playwright-reports'
                bat 'docker-compose run tests sh -c "npx playwright test && ls -la /usr/src/app"'
                
            }
        }

    //     stage('Collect Report') {
    //         steps {
    //             // Create reports directory first
    //             bat 'dir playwright-reports || echo No reports found'
                
    //             // Run tests with volume mounted
    //             archiveArtifacts artifacts: 'playwright-reports/**/*', fingerprint: true, allowEmptyArchive: true
    //         }
    //     }
    }
    post {
        always {
            // Clean up - stop all containers
            bat 'docker-compose down || true'
            cleanWs()
        }
    }
}