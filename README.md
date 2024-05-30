Media Bias
==========

This project extracts data from [AllSides.com](https://www.allsides.com/) and compiles it into a single JSON file containing the bias metrics for each news source.

## Requirements

This project requires `curl`, `node`, and the `git` checkout:

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install node
git clone 
````

## Local Usage

The following command will scrape the current state of AllSides data and compile it into a date-stamped JSON in the `dist` folder:

```bash
cd media-bias
./update.sh
```

## Remote Usage

If you just want to use the JSON as is, you can reference the [latest media bias JSON](dist/latest-media-bias.json) with the following URL:

```
?
```