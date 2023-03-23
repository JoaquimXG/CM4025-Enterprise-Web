output "public_ip" {
  value = aws_instance.instance.public_ip
}

output "private_ip" {
  value = aws_instance.instance.private_ip
}

output "eip" {
  value = concat([aws_eip.eip.*.public_ip], [null])[0]
}
