import { getEventPayload, getEventPreImage } from "../src/lib"

const trace = {
  block_id: '0a4ef77ece31426591abdae2d7ac1931ecd355af21107455bb6d1273a8974933',
  trx_id: 'ce2dceaa55b5cb2e88d31d8e1334335268930c0c665362760a9c833083c5789d',
  act: {
    account: 'pnetworkadp2',
    name: 'swap',
    data: {
      event_bytes: '00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000656F73747374746F6B656E310000000000000000000000000000000000000000000000000000000000AA36A70000000000000000000000000000000000000000000000000DDAAC8F8F45C0000000000000000000000000000000000000000000706E6574776F726B75737232000000000000000000000000000000000000000000000000000000000000002A307861343136353762663232354638456337453230313043383963334630383431373239343832363444'
    }
  }
}

const context = '010273e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d'

const EVENT_PAYLOAD = '0000000000000000000000000000000000000000706e6574776f726b6164703200000000000000000000000000000000000000000000000000000000737761700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b226576656e745f6279746573223a22303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303036353646373337343733373437343646364236353645333130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030414133364137303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030304444414143384638463435433030303030303030303030303030303030303030303030303030303030303030303030303030303030303037303645363537343737364637323642373537333732333230303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303241333037383631333433313336333533373632363633323332333534363338343536333337343533323330333133303433333833393633333334363330333833343331333733323339333433383332333633343434227d'
const PREIMAGE = '010273e4385a2708e6d7048834fbc1079f2fabb17b3c125b146af438971e90716c4d0a4ef77ece31426591abdae2d7ac1931ecd355af21107455bb6d1273a8974933ce2dceaa55b5cb2e88d31d8e1334335268930c0c665362760a9c833083c5789d0000000000000000000000000000000000000000706e6574776f726b6164703200000000000000000000000000000000000000000000000000000000737761700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007b226576656e745f6279746573223a22303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303036353646373337343733373437343646364236353645333130303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030414133364137303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030304444414143384638463435433030303030303030303030303030303030303030303030303030303030303030303030303030303030303037303645363537343737364637323642373537333732333230303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303030303241333037383631333433313336333533373632363633323332333534363338343536333337343533323330333133303433333833393633333334363330333833343331333733323339333433383332333633343434227d'

describe('Antelope provider', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.restoreAllMocks()
  })

  describe('getEventPayload', () => {
    it('should return the event payload', async () => {
      const eventPayload =  getEventPayload(trace)
      expect(eventPayload).toEqual(EVENT_PAYLOAD)
    })
  })

  describe('getEventPreImage', () => {
    it('should return the event payload', async () => {
      const eventPreImage = getEventPreImage(trace, context)
      expect(eventPreImage).toEqual(PREIMAGE)
    })
  })
})