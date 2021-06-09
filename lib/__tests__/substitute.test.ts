import { substitute } from '../substitute';

test('no substitution', () => {
  expect(substitute('hello world')).toEqual('hello world');
  expect(substitute('')).toEqual('');
  expect(substitute('{{ almost ')).toEqual('{{ almost ');
});

test('substitutions', () => {
  const vars = {
    foo: '1234',
    bar: 'hello',
    $test: 'hi',
  };

  expect(substitute('hello {{foo}}', vars)).toEqual('hello 1234');
  expect(substitute('hello {{ foo}}', vars)).toEqual('hello 1234');
  expect(substitute('hello {{foo   }}', vars)).toEqual('hello 1234');
  expect(substitute('hello {{bar}}{{foo   }}', vars)).toEqual('hello hello1234');
  expect(substitute('hello {{bar }}-{{foo}}+', vars)).toEqual('hello hello-1234+');
  expect(substitute('{{$test}}', vars)).toEqual('hi');
});

test('empty substitution', () => {
  expect(substitute('hello{{}} world')).toEqual('hello world');
  expect(substitute('hello{{   }} world')).toEqual('hello world');
});