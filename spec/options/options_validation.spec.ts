import _Ajv from "../ajv"
require("../chai").should()
const DATE_FORMAT = /^\d\d\d\d-[0-1]\d-[0-3]\d$/

describe("validation options", () => {
  describe("format", () => {
    it("should not validate formats if option format == false", () => {
      const ajv = new _Ajv({formats: {date: DATE_FORMAT}}),
        ajvFF = new _Ajv({formats: {date: DATE_FORMAT}, format: false})

      const schema = {format: "date"}
      const invalideDateTime = "06/19/1963" // expects hyphens

      ajv.validate(schema, invalideDateTime).should.equal(false)
      ajvFF.validate(schema, invalideDateTime).should.equal(true)
    })
  })

  describe("formats", () => {
    it("should add formats from options", () => {
      const ajv = new _Ajv({
        formats: {
          identifier: /^[a-z_$][a-z0-9_$]*$/i,
        },
      })

      const validate = ajv.compile({format: "identifier"})

      validate("Abc1").should.equal(true)
      validate("foo bar").should.equal(false)
      validate("123").should.equal(false)
      validate(123).should.equal(true)
    })
  })

  describe("keywords", () => {
    it("should add keywords from options", () => {
      const ajv = new _Ajv({
        keywords: [
          {
            keyword: "identifier",
            type: "string",
            validate: function (_schema, data) {
              return /^[a-z_$][a-z0-9_$]*$/i.test(data)
            },
          },
        ],
      })

      const validate = ajv.compile({identifier: true})

      validate("Abc1").should.equal(true)
      validate("foo bar").should.equal(false)
      validate("123").should.equal(false)
      validate(123).should.equal(true)
    })
  })

  describe("unicode", () => {
    it("should use String.prototype.length with deprecated unicode option == false", () => {
      const ajvUnicode = new _Ajv()
      testUnicode(new _Ajv({unicode: false, logger: false}))
      testUnicode(new _Ajv({unicode: false, allErrors: true, logger: false}))

      function testUnicode(ajv) {
        let validateWithUnicode = ajvUnicode.compile({minLength: 2})
        let validate = ajv.compile({minLength: 2})

        validateWithUnicode("😀").should.equal(false)
        validate("😀").should.equal(true)

        validateWithUnicode = ajvUnicode.compile({maxLength: 1})
        validate = ajv.compile({maxLength: 1})

        validateWithUnicode("😀").should.equal(true)
        validate("😀").should.equal(false)
      }
    })
  })

  describe("multipleOfPrecision", () => {
    it("should allow for some deviation from 0 when validating multipleOf with value < 1", () => {
      test(new _Ajv({multipleOfPrecision: 7}))
      test(new _Ajv({multipleOfPrecision: 7, allErrors: true}))

      function test(ajv) {
        let schema = {multipleOf: 0.01}
        let validate = ajv.compile(schema)

        validate(4.18).should.equal(true)
        validate(4.181).should.equal(false)

        schema = {multipleOf: 0.0000001}
        validate = ajv.compile(schema)

        validate(53.198098).should.equal(true)
        validate(53.1980981).should.equal(true)
        validate(53.19809811).should.equal(false)
      }
    })
  })
})