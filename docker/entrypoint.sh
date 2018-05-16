#!/bin/bash -e

[[ ${DEBUG} == true ]] && set -x

####################################################################
# Other Settings
####################################################################

export UMASK=0002

####################################################################
# Main startup
####################################################################

if [ "$1" == "bash" ] ; then
    exec "$@"
else
    # We will run as svc_aics_prod_rw. But first change the UID/GID if necessary
    # source /default_service_params
    # if [ ! -z "${SERVICE_UID}" ] && [ ${SERVICE_UID} != ${default_service_uid} ] ; then
    #     /usr/sbin/groupmod -g ${SERVICE_UID} domain_users
    #     /usr/sbin/usermod -u ${SERVICE_UID} -g ${SERVICE_UID} svc_aics_prod_rw
    # fi

    # Always run as svc_aics_prod_rw inside the container
    # for d in $service_home/*; do chown -R svc_aics_prod_rw:domain_users $d || echo "Couldn't chown $d to service user"; done
    chown -R svc_aics_prod_rw:domain_users /usr/src/app
    # Now execute - the default is
    # > gosu svc_aics_prod_rw /${service_name}/bin/${service_name}
    exec "$@"
fi
