import handlebars from 'handlebars'
import fs from 'fs'

import IMailTermplateProvider from '../models/IMailTemplateProvider'
import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'

class HandlebarsMailTemplateProvider implements IMailTermplateProvider {
  public async parse({
    file,
    variables
  }: IParseMailTemplateDTO): Promise<string> {
    const templatefileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    })
    const parseTemplate = handlebars.compile(templatefileContent)

    return parseTemplate(variables)
  }
}

export default HandlebarsMailTemplateProvider
