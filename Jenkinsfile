String[] IGNORE_AUTHORS = ["jenkins", "Jenkins User", "Jenkins Builder"]

pipeline {
    options {
        disableConcurrentBuilds()
        timeout(time: 1, unit: "HOURS")
    }
    agent any
    triggers {
        pollSCM("H */4 * * 1-5")
    }
    parameters {
        booleanParam(name: "PUBLISH", defaultValue: false, description: "Publish to npm")
        choice(name: "VERSION", choices: ["patch", "minor", "major", "prepatch", "preminor", "premajor", "prerelease"], description: "Release type. This is only used when PUBLISH is set to true.")
    }
    stages {
        stage ("initialize") {
            when {
                anyOf {
                    expression { !IGNORE_AUTHORS.contains(gitAuthor()) }
                    expression { return params.PUBLISH }
                }
            }
            steps {
                this.notifyBB("INPROGRESS")
                sh "./gradlew npm_install"
            }
        }
        stage ("integration: lint, and build") {
            when {
                anyOf {
                    expression { !IGNORE_AUTHORS.contains(gitAuthor()) }
                    expression { return params.PUBLISH }
                }
            }
            steps {
                sh "./gradlew lint"
                // sh "./gradlew test"
                sh "./gradlew build"
            }
        }
        stage ("publish") {
            when {
                expression { return params.PUBLISH }
            }
            steps {
                sh "./gradlew version -PreleaseType=${params.VERSION}"
                sh "./gradlew npm_publish"
            }
        }
    }
    post {
        always {
            this.notifyBB(currentBuild.result)
        }
        cleanup {
            deleteDir()
        }
    }
}

def notifyBB(String state) {
    // on success, result is null
    state = state ?: "SUCCESS"

    if (state == "SUCCESS" || state == "FAILURE") {
        currentBuild.result = state
    }

    notifyBitbucket commitSha1: "${GIT_COMMIT}",
            credentialsId: "aea50792-dda8-40e4-a683-79e8c83e72a6",
            disableInprogressNotification: false,
            considerUnstableAsSuccess: true,
            ignoreUnverifiedSSLPeer: false,
            includeBuildNumberInKey: false,
            prependParentProjectKey: false,
            projectKey: "SW",
            stashServerBaseUrl: "https://aicsbitbucket.corp.alleninstitute.org"
}

def gitAuthor() {
    sh(returnStdout: true, script: 'git log -1 --format=%an').trim()
}