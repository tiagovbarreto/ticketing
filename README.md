# ticketing

## Local environment setup

### Minikube Setup on Linux

These instructions should be valid for Debian / Ubuntu / Mint Linux distributions. Your experience may vary if using an RHEL / Arch / Other distribution or non desktop distro like Ubuntu server, or lightweight distros which may omit many expected tools.

### Install VirtualBox:

Find your Linux distribution and download the .deb package, using a graphical installer here should be sufficient. If you use a package manager like apt to install from your terminal, you will likely get a fairly out of date version.

https://www.virtualbox.org/wiki/Linux_Downloads

After installing, check your installation to make sure it worked:

```sh
$ VBoxManage —version
```

As an alternative you can use (or maybe you have to use) KVM instead of VirtualBox. Here are some great instructions that can be found in this post (Thanks to Nick L. for sharing):

https://computingforgeeks.com/install-kvm-centos-rhel-ubuntu-debian-sles-arch/


### Install Kubectl

In your terminal run the following:

```sh
$ curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
```

```sh
$ chmod +x ./kubectl
```

```sh
$ sudo mv ./kubectl /usr/local/bin/kubectl
```

Check your Installation:
```sh
$ kubectl version
```

See also official docs:
https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux


### Install Minikube

In your terminal run the following:
```sh
$ curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && chmod +x minikube
```
```sh
$ sudo install minikube /usr/local/bin
```

Check your installation:
```sh
$ minikube version
```

```sh
$ Start Minikube:
```
minikube start


See also official docs:

https://kubernetes.io/docs/tasks/tools/install-minikube/

## Deploy setup to Digital Ocean

Install doctl via snap on ubuntu
