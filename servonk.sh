#!/bin/bash

set -e

function usage {
    echo "Usage: $0 {build|flash|run} {gonk|glutin} <opts>"
    exit 1
}

function script {
    cd platform/$platform/support/scripts
    script="./$1.sh"
    shift
    $script $@
}

if [ $# -lt 2 ]
then
    usage
fi

cmd=$1
shift
platform=$1
shift

case "$cmd" in
    build)
        script build $@
        ;;
    run)
        script run $@
        ;;
    flash)
        script flash $@
        ;;
    *)
        usage
esac
