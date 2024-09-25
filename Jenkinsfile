pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "poojadissanayake/hd-pipeline:${env.BUILD_ID}"
        MONGO_CREDENTIALS = credentials('mongo-connection')
        SONARQUBE_URL = 'http://localhost:9000'
        SONAR_TOKEN = credentials('sonarqube-token')
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
                    // Run SonarQube analysis
                    withSonarQubeEnv('SonarQube') {
                        sh """
                        sonar-scanner \
                        -Dsonar.projectKey=test-pipeline \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=${SONARQUBE_URL} \
                        -Dsonar.login=${SONAR_TOKEN}
                        """
                    }
                }
            }
        }
        stage('Security Scan'){
            steps{
                echo "Perform a security scan on the code using a tool to identify any vulnerabilities."
                echo "Tool: Burp Suit"
            }
            post {
                success {
                    echo 'Security Scan Success.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Security Scan Success",
                        body: "Security Scan stage completed successfully.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
                failure {
                    echo 'Security Scan failed.'
                    mail to: 'poojadissanayake6@gmail.com',
                        subject: "Security Scan failed",
                        body: "Security Scan failed.\n\n" +
                            "Check the build logs at ${env.BUILD_URL}"
                }
            }
        }
        stage('Deploy to Staging'){
            steps{
                echo "Deploy the application to a staging server"
                echo "Tool: AWS Cloudformation"
            }
        }
        stage('Integration Tests on Staging'){
            steps{
                echo "Run integration tests on the staging environment to ensure the application functions as expected in a production-like environment"
                echo "Tool: Selenium"
            }
        }
        stage('Deploy to Production'){
            steps{
                echo "Deploy the application to a production server"
                echo "Tool: AWS Cloudformation"
            }
        }
    }
}