import chai from 'chai'
import ExpressionParser from '../src'
let should = chai.should()
let expect = chai.expect

describe('test api', ()=>{
    let parser = new ExpressionParser()
    it('should equal 5',()=>{
        parser.parse('2+3').should.be.equal(5)
    })

    it('should equal 5',()=>{
        parser.parse('a + b',{
            a:2,
            b:3
        }).should.be.equal(5)
    })

    it('should equal 5',()=>{
        parser.parse('max(a,b)',{
            a:5,
            b:3,
            max:Math.max
        }).should.be.equal(5)
    })

    it('should equal janry 8',()=>{
        parser.parse('a+b | addPrefix : name',{
            a:5,
            b:3,
            name:'janry '
        },{
            addPrefix:(name)=>(input)=> name + input
        }).should.be.equal('janry 8')
    })

})
