This will describe the files in the Servonk repo AND the other dependent repos.

# [Servonk repo] (https://github.com/fabricedesre/servonk)
## Root
### [rust-toolchain] (https://github.com/fabricedesre/servonk/blob/master/rust-toolchain)
Contains the current version of the Rust toolchain which is used by Servo. This is updated by manually running update-servo.sh script.

### [bootstrap.sh] (https://github.com/fabricedesre/servonk/blob/master/bootstrap.sh)
This checks the current version of the [rust-toolchain] (https://github.com/fabricedesre/servonk/blob/master/rust-toolchain), installs the rust toolchain for your current platform and the target armv7-linux-androideabi uaing the current vrsion and sets the override so that within the Servonk directory it will use this installed version of the toolchain for work on Servonk. This will only work if you have already installed [rustup] (https://github.com/rust-lang-nursery/rustup.rs), which is part of the dependencies for Servo (and therefore Servonk) as described [here] (https://github.com/servo/servo/blob/master/README.md#setting-up-your-environment).

[Bindgen] (https://github.com/rust-lang-nursery/rust-bindgen) is needed to generate Rust FFI bindings to the [mtdev C library] (https://github.com/fabricedesre/servonk/tree/master/platform/gonk/mtdev/mtdev-1.1.5). "command -v bindgen >/dev/null 2>&1 || { etc..." checks if bindgen exists and if not it installs it with "cargo install -f bindgen".

### [servonk] (https://github.com/fabricedesre/servonk/blob/master/servonk)


### [update-servo.sh] (https://github.com/fabricedesre/servonk/blob/master/update-servo.sh)
This script updates the Servonk repo with key resources from a Servo repository. The location of the Servo repository is given as an argument to the script. The script copies:
* The /resources directory of the Servo repository into the [/platform/shared] (https://github.com/fabricedesre/servonk/tree/master/platform/shared/resources) directory of the Servonk repository,
* The cargo.lock file into the [/platform/gonk] (https://github.com/fabricedesre/servonk/tree/master/platform/gonk) and [/platform/glutin] (https://github.com/fabricedesre/servonk/tree/master/platform/glutin) directories of the Servonk repository
* rust-toolchain into the Servonk respository
* For Gonk only, update the [cargo.lock] (https://github.com/fabricedesre/servonk/blob/master/platform/gonk/Cargo.lock) with the package versions for Fabrice's forks of [mozjs_sys] (https://github.com/fabricedesre/mozjs.git), [rust-webvr] (https://github.com/fabricedesre/rust-webvr.git) and [rust-webvr-api] (https://github.com/fabricedesre/rust-webvr.git).

The script also runs [bootstrap.sh] (https://github.com/fabricedesre/servonk/blob/master/bootstrap.sh) to update the Rust toolchain and Bindgen.
