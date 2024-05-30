Media Bias
==========

This project extracts data from [AllSides.com](https://www.allsides.com/) and compiles it into a single JSON file containing the bias metrics for each news source.

### Media Bias Structure

This is how the JSONs in the [`dist`](dist) folder a structured:

* **Consensus**: This section provides statistics about how well the community agrees with AllSides ideology assignment of a news source.
  * **left, centerLeft, center, centerRight, right**: Each generalized American ideology has its own section made of the following properties:
    * **label**: The numerical value the ideology uses in each news sources `bias` property
    * **totalSources**: How many sources AllSides has for this ideology
    * **minScore**: The lowest community agreement for a news source in this ideology
    * **maxScore**: The highest community agreement for a news source in this ideology
    * **average**: The average community agreement for all news sources in this ideology
* **Sources**: All of the authors, news media, think tank/policy groups, and references AllSides uses
  * **url**: The URL to get more details about this source
  * **source**: The name of the source
  * **page**: What page in the `data` folder this source can be found in
  * **bias**: The numerical ideological label for this source
  * **agree**: How many people in the AllSides communtiy agrees with this bias assignment
  * **disagree**: How many people in the AllSides communtiy disagree with this bias assignment
  * **consensus**": The agree-to-disagree ratio of this source

## Requirements

This project requires `curl`, `node`, and the `git` checkout:

```bash
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install node
git clone https://github.com/PsySecGroup/media-bias.git
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
https://raw.githubusercontent.com/PsySecGroup/media-bias/main/dist/latest-media-bias.json
```