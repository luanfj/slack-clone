import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO'

export default interface IMailTermplateProvider {
  parse(data: IParseMailTemplateDTO): Promise<string>
}
