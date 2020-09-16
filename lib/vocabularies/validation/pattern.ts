import type {CodeKeywordDefinition} from "../../types"
import type KeywordCxt from "../../compile/context"
import {usePattern} from "../util"
import {_, str} from "../../compile/codegen"

const def: CodeKeywordDefinition = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: true,
  code(cxt: KeywordCxt) {
    const {gen, data, $data, schema, schemaCode} = cxt
    const regExp = $data ? _`(new RegExp(${schemaCode}, "u"))` : usePattern(gen, schema) // TODO regexp should be wrapped in try/catch
    cxt.fail$data(_`!${regExp}.test(${data})`)
  },
  error: {
    message: ({schemaCode}) => str`should match pattern "${schemaCode}"`,
    params: ({schemaCode}) => _`{pattern: ${schemaCode}}`,
  },
}

module.exports = def