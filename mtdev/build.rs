extern crate cc;

use std::fs::{self, DirBuilder, File};
use std::io::Write;
use std::path::Path;
use std::env;

// Location of the C library
static C_LIBRARY_DIR: &'static str = "mtdev-1.1.5";

// TODO: unwrap less.
fn generate_mod(dir: &str) {
    // Look for all the *.rs file and subdirectories in this directory
    //  and add them to the local mod.rs
    let path = Path::new(dir);
    if !path.is_dir() {
        return;
    }
    let mut items = vec![];

    for entry in fs::read_dir(dir).unwrap() {
        let entry = entry.unwrap();
        let path = entry.path();
        if path.is_dir() {
            if let Some(p) = path.file_name() {
                items.push(p.to_str().unwrap().to_owned());
            }
        }

        if let Some(ext) = path.extension() {
            if ext == "rs" && !path.ends_with("mod.rs") {
                if let Some(p) = path.file_stem() {
                    items.push(p.to_str().unwrap().to_owned());
                }
            }
        }
    }

    let mut mod_file = File::create(path.join("mod.rs")).unwrap();
    for item in items {
        mod_file
            .write_fmt(format_args!("#[macro_use] pub mod {};\n", item))
            .unwrap();
    }
}

fn main() {
    let library_dir = format!(
        "{}/{}",
        env::var("CARGO_MANIFEST_DIR").unwrap(),
        C_LIBRARY_DIR
    );
    let build_dir = format!("{}", env::var("OUT_DIR").unwrap());

    // Run C library build script
    let status = std::process::Command::new("./build.sh")
        .env("C_LIBRARY_DIR", library_dir)
        .env("C_BUILD_DIR", build_dir.clone())
        .status()
        .unwrap();
    assert!(
        status.code().unwrap() == 0,
        "Build script \"./build.sh\" exited with non-zero exit status!"
    );

    // Expose built library to cargo
    println!("cargo:rustc-link-lib=static=mtdev");
    println!("cargo:rustc-link-search=native={}/lib", build_dir);

    // Generate the ffi
    let status = std::process::Command::new("./bindgen.sh").status().unwrap();
    assert!(
        status.code().unwrap() == 0,
        "Build script \"./bindgen.sh\" exited with non-zero exit status!"
    );

    let _ = DirBuilder::new().recursive(true).create("src/generated");

    generate_mod("src/generated");

    println!("cargo:rerun-if-changed=bindgen.sh");
}
