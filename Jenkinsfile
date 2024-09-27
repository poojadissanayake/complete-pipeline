pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "poojadissanayake/hd-pipeline:${env.BUILD_ID}"
        MONGO_CREDENTIALS = credentials('mongo-connection')
        SONARQUBE_URL = 'http://localhost:9000'
        SONAR_TOKEN = credentials('sonarQube')
    }
    stages {
        stage('Build'){
            steps{
                script {
                    echo 'Building Docker image...'
                    // Build the Docker image
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                }
            }
        }
        stage('Test'){
            steps{
                script {
                    echo 'Running tests...'
                    // Run the Docker container, passing MongoDB credentials and running the tests
                    sh """
                    docker run --rm -d \
                    -e MONGO_USER=${MONGO_CREDENTIALS_USR} \
                    -e MONGO_PASS=${MONGO_CREDENTIALS_PSW} \
                    --name hd-pipeline ${DOCKER_IMAGE} npm start
                    sleep 10  # Allow the application to start up
                    docker exec hd-pipeline npm test
                    docker stop hd-pipeline
                    """
                }
            }
            post {
                success {
                    echo 'Testing Success.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Testing Success",
                        body: "Testing stage completed successfully.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
                failure {
                    echo 'Testing failed.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Testing failed",
                        body: "Testing failed.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
            }
        }
        stage('Code Analysis') {
            steps {
                script {
                    echo "Running SonarQube analysis..."
                    def scannerHome = tool 'SonarScanner';
                    // Run SonarQube analysis
                    withSonarQubeEnv('sonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                        sh """
                        sonar-scanner \
                        -Dsonar.projectKey=hd-task-sonarqube \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONARQUBE_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        stage('Deploy to Staging') {
            steps {
                script {
                    echo "Deploying application to staging environment using Docker Compose..."

                    // Push Docker image to DockerHub
                    sh "docker push ${DOCKER_IMAGE}"
                    
                    // SSH into staging server, pull the Docker image, and run Docker Compose
                    sshagent(['ec2-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@3.107.167.95 '
                            # Navigate to the directory with docker-compose.yml
                            cd /home/ubuntu/ &&

                            # Pull the latest Docker image
                            sudo docker-compose pull &&

                            # Stop and remove existing containers (if any)
                            sudo docker-compose down &&

                            # Start the application with the new Docker image
                            sudo docker-compose up -d
                        '
                    '''
                    }
                }
            }
            post {
                success {
                    echo 'Deployment to Staging using Docker Compose succeeded.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Deployment to Staging Success",
                        body: "Deployment to staging completed successfully using Docker Compose.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
                failure {
                    echo 'Deployment to Staging using Docker Compose failed.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Deployment to Staging Failed",
                        body: "Deployment to staging failed using Docker Compose.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
            }
        }
    }
}