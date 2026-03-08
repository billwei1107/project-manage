import pexpect

child = pexpect.spawn('ssh -o StrictHostKeyChecking=no root@54.255.186.244 "cat /root/api_test_out.txt"')
child.expect('password:')
child.sendline('NerssBiU56')
child.expect(pexpect.EOF)
print(child.before.decode('utf-8'))
