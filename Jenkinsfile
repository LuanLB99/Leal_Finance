pipeline {
    agent any

    environment {
        // Nome da rede que criaremos para o teste
        DB_NETWORK = "test-network-${BUILD_NUMBER}"
    }

    stages {
        stage('Setup Environment') {
            steps {
                // Cria uma rede isolada para esta execução
                sh "docker network create ${DB_NETWORK}"
                // Sobe o banco Postgres nessa rede
                sh "docker run -d --name db-test-${BUILD_NUMBER} --network ${DB_NETWORK} -e POSTGRES_PASSWORD=minhasenha -e POSTGRES_DB=financas_db postgres:15"
            }
        }

        stage('Build & Test') {
            steps {
                // Roda o Maven passando o perfil de teste e a rede do Docker
                // Usamos uma imagem Maven para rodar os testes dentro da rede
                sh """
                docker run --rm --network ${DB_NETWORK} \
                -v ${WORKSPACE}:/app -w /app \
                maven:3.9-eclipse-temurin-21 \
                mvn clean test -Dspring.profiles.active=test
                """
            }
        }
    }

    post {
        always {
            // Limpeza: remove o container do banco e a rede, não importa se deu erro ou sucesso
            sh "docker rm -f db-test-${BUILD_NUMBER} || true"
            sh "docker network rm ${DB_NETWORK} || true"
        }
    }
}