import IMailTermplateProvider from '../models/IMailTemplateProvider'

class FakeMailTemplateProvider implements IMailTermplateProvider {
  public async parse(): Promise<string> {
    return 'Mail content'
  }
}

export default FakeMailTemplateProvider
