# Plan B-eer - Self-Contained Infrastructure for PicoBrew Z (User Interface)

No specialized hardware.  If you have a Windows Machine with Wifi, you can probably run this inside an hour.

<b> Latest Release: 0.9 ALPHA </b>

It's been quiet for a while, but time for a new release.   It's still Alpha.  PLEASE test before running something important on it.  Some brave souls are running the previous release with quite positive results.   

Anyone can run this, no special hardware required.  Deployable on AWS, it's 30min gate-to-gate from start to machine on.

<b> This release features: </b>
- Ability to import Recipes and Sessions from PicoBrew
- Tie imported items to Machines
- Brews all seem to work (and update in UI)
- Graphs and Recipe view 
- Full web app with Database Storage 
- Easy deploy to AWS.

<b> Missing Features </b>
- Set Machine to Use Imperial
- You can't edit/create recipes
- It isn't secure by default
- It builds on ARM/RPi, but no multi-platform images yet.
- There are bugs.  It's designed for refresh/retry.
- Only Desktop supported.  Mobile will probably look funny.

![Main View](/tree/master/images/BrewingView.png?raw=true "Main View")
[Active Rinse](/tree/master/images/ActiveRinse.png?raw=true "Active Rinse")
[Recipe](/tree/master/images/Recipe.png?raw=true "Recipe View")
[Chart](/tree/master/images/Chart.png?raw=true "Chart View")
[Import Pico Data](/tree/master/images/Import.png?raw=true "Import Pico Data")

# Deploying AWS

Instructions on Main Page

Order | File | Purpose
1 | [1-VPC] (https://github.com/widdix/aws-cf-templates/blob/master/vpc/vpc-2azs.yaml) | Networking - Based on the Widdix Cluster
2 | 2-aws-planbeer-storage.yaml | Storage Layer - Planbeer (3) can be removed without losing data
3 | 3-aws-planbeer-cluster.yaml | Planbeer App - The App, DB, UI Layer 

# Running Containers

### No Options

### Dependencies
[Planbeer Server](https://github.com/duffyco/planbeer) 

### Run Container
docker run -p 80:80 planbeer:latest

## Thanks
Design is Heavily Borrowed from Sonarr.  https://sonarr.tv/
Based off Widdix AWS scripts - amazing work.  https://github.com/widdix/aws-cf-templates
