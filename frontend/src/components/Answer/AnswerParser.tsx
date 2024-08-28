import { cloneDeep } from 'lodash'

import { AskResponse, Citation, AzureSqlServerCodeExecResult } from '../../api'

export type ParsedAnswer = {
  citations: Citation[]
  markdownFormatText: string,
  plotly_data: AzureSqlServerCodeExecResult | null
}

export const enumerateCitations = (citations: Citation[]) => {
  const filepathMap = new Map()
  for (const citation of citations) {
    const { filepath } = citation
    let part_i = 1
    if (filepathMap.has(filepath)) {
      part_i = filepathMap.get(filepath) + 1
    }
    filepathMap.set(filepath, part_i)
    citation.part_index = part_i
  }
  return citations
}

export function parseAnswer(answer: AskResponse): ParsedAnswer {
  let answerText = answer.answer
  const citationLinks = answerText.match(/\[(doc\d\d?\d?)]/g)

  const lengthDocN = '[doc'.length

  let filteredCitations = [] as Citation[]
  let citationReindex = 0
  citationLinks?.forEach(link => {
    // Replacing the links/citations with number
    const citationIndex = link.slice(lengthDocN, link.length - 1)
    const citation = cloneDeep(answer.citations[Number(citationIndex) - 1]) as Citation
    if (!filteredCitations.find(c => c.id === citationIndex) && citation) {
      answerText = answerText.replaceAll(link, ` ^${++citationReindex}^ `)
      citation.id = citationIndex // original doc index to de-dupe
      citation.reindex_id = citationReindex.toString() // reindex from 1 for display
      filteredCitations.push(citation)
    }
  })

  filteredCitations = enumerateCitations(filteredCitations)

  console.log(answerText);
  if (answerText == "The requested information is not available in the retrieved data. Please try another query or topic.")
    { 
      answerText = "Hi there! While I can't help with that specific question, I can definitely assist with any HR-related queries that you may have. Feel free to ask me anything about CoCT HR policies!";
    }
  if (answerText.indexOf('The retrieved documents do not contain any information') !== -1) 
  {
      answerText = "Hi there! While I can't help with that specific question, I can definitely assist with any HR-related queries that you may have. Feel free to ask me anything about CoCT HR policies!";
  }

  return {
    citations: filteredCitations,
    markdownFormatText: answerText,
    plotly_data: answer.plotly_data
  }
}
