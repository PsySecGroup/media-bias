const fs = require('fs-extra')
const cheerio = require('cheerio')
const path = require('path')

/**
 *
 */
function getBiasScore (bias) {
  switch (bias) {
    case 'left':
      return -2
    case 'left-center':
      return -1
    case 'allsides':
    case 'center':
      return 0
    case 'right-center':
      return 1
    case 'right':
      return 2
  }
}

/**
 * Function to process HTML files and convert to JSON lines
 */
const processHtmlFiles = async () => {
  const result = {
    consensus: {
      left: {
        label: -2,
        totalSources: 0,
        totalScore: 0,
        minScore: 1,
        maxScore: -1,
        average: 0,
      },
      centerLeft: {
        label: -1,
        totalSources: 0,
        totalScore: 0,
        minScore: 1,
        maxScore: -1,
        average: 0
      },
      center: {
        label: 0,
        totalSources: 0,
        totalScore: 0,
        minScore: 1,
        maxScore: -1,
        average: 0
      },
      centerRight: {
        label: 1,
        totalSources: 0,
        totalScore: 0,
        minScore: 1,
        maxScore: -1,
        average: 0
      },
      right: {
        label: 2,
        totalSources: 0,
        totalScore: 0,
        minScore: 1,
        maxScore: -1,
        average: 0
      },
    },
    sources: []
  }

  const files = await fs.readdir('data')

  for (const file of files) {
    if (file.startsWith('page_') && file.endsWith('.html')) {
      const html = await fs.readFile('data/' + file, 'utf-8')
      const page = parseInt(file.substring(
        file.indexOf('_') + 1,
        file.indexOf('.'),
      ))
      const $ = cheerio.load(html)
      
      $('tr').each((index, element) => {
        const el = $(element)
        if (el.attr('class') === undefined) {
          return
        }

        const bias = el.find('.views-field-field-bias-image a')[0].attribs.href
        const agree = parseInt(el.find('.agree')[0].children[0].data)
        const disagree = parseInt(el.find('.disagree')[0].children[0].data)

        const data = {
          url: 'https://www.allsides.com' + el.find('.source-title a')[0].attribs.href,
          source: el.find('.source-title a')[0].children[0].data,
          page,
          bias: getBiasScore(bias.substring(bias.lastIndexOf('/') + 1)),
          agree,
          disagree,
          consensus: disagree === 0
            ? (agree + 1) / (disagree + 1)
            : agree / disagree
        }

        result.sources.push(data)

        let key

        switch (data.bias) {
          case -2:
            key = 'left'
            break
          case -1:
            key = 'centerLeft'
            break
          case 0:
            key = 'center'
            break
          case 1:
            key = 'centerRight'
            break
          case 2:
            key = 'right'
            break
        }

        result.consensus[key].totalSources += 1
        result.consensus[key].totalScore += data.consensus

        if (data.consensus !== 0 && data.consensus > result.consensus[key].maxScore) {
          result.consensus[key].maxScore = data.consensus
        }

        if (data.consensus !== 0 && data.consensus < result.consensus[key].minScore) {
          result.consensus[key].minScore = data.consensus
        }
      })
    }
  }

  result.consensus.left.average = result.consensus.left.totalScore / result.consensus.left.totalSources
  result.consensus.centerLeft.average = result.consensus.centerLeft.totalScore / result.consensus.centerLeft.totalSources
  result.consensus.center.average = result.consensus.center.totalScore / result.consensus.center.totalSources
  result.consensus.centerRight.average = result.consensus.centerRight.totalScore / result.consensus.centerRight.totalSources
  result.consensus.right.average = result.consensus.right.totalScore / result.consensus.right.totalSources

  return result
}

/**
 *
 */
const getFormattedDate = () => {
    const date = new Date();

    const year = date.getFullYear();

    // Months are zero-based in JavaScript, so add 1 and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Pad the day with zero if needed
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}${month}${day}`;
}

// Run the function to process the HTML files
async function main () {
  const biases = await processHtmlFiles()
  const outputFile = `dist/${getFormattedDate()}-media-bias.json`

  // Initialize the output file
  fs.writeFileSync(outputFile, JSON.stringify(biases, null, 2))
  fs.writeFileSync('dist/latest-media-bias.json', JSON.stringify(biases, null, 2))
}

main()
