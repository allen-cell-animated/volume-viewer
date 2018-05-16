#!groovy

node ("docker")
{
    // Get Build Date and Version
    def build_date = buildDate()

    try {
        // Checkout the branch to build. This will use the jenkins user key in stash
        stage ("git") {
            def git_url=gitUrl()
            git url: "${git_url}", branch: "${env.BRANCH_NAME}"
        }

        stage ("docker build") {
            sh "build-docker -n -B -b ${env.BUILD_NUMBER} -D ${build_date}"
        }

        stage ("docker publish/cleanup") {
            sh "push-docker -b ${env.BUILD_NUMBER} -D ${build_date} -d -l IMAGE_LIST"
        }
        currentBuild.result = "SUCCESS"
    }
    catch(e) {
        // If there was an exception thrown, the build failed
        currentBuild.result = "FAILURE"
        throw e
    }
    finally {
        archive 'build/docker_build_output.txt'
        sh 'clean-docker'

        // Slack
        notifyBuildOnSlack(currentBuild.result)

        // Email
        step([$class: 'Mailer',
              notifyEveryUnstableBuild: true,
              recipients: '!AICS_DevOps@alleninstitute.org',
              sendToIndividuals: true])
    }
}

def gitUrl() {
    checkout scm
    sh(returnStdout: true, script: 'git config remote.origin.url').trim()
}

def buildDate() {
    sh 'date +%Y%m%d > BUILD_DATE'
    readFile('BUILD_DATE').trim()
}

def imageVersion() {
    def matcher = readFile('image.properties') =~ 'image_version=(.+)'
    matcher ? matcher[0][1] : null
}

def imageName() {
    def matcher = readFile('image.properties') =~ 'image_name=(.+)'
    matcher ? matcher[0][1] : null
}

def notifyBuildOnSlack(String buildStatus = 'STARTED') {
    // build status of null means successful
    buildStatus =  buildStatus ?: 'SUCCESS'

    // Default values
    def branch = env.BRANCH_NAME
    def image_name = imageName()
    def image_version = imageVersion()
    def image_list = readFile('IMAGE_LIST').trim()

    def message = "${buildStatus}" +
            "\nImage: ${image_name}:${image_version}" +
            "\nBranch: ${branch}" +
            "\n(${env.BUILD_URL})" +
            "\nImages: ${image_list}"

    // Override default values based on build status
    if (buildStatus == 'SUCCESS') {
        colorCode = '#00FF00'
    } else {
        colorCode = '#FF0000'
    }

    // Send notifications
    slackSend (color: colorCode, message: message)
}
