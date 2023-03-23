output "ip" {
  value = module.instance.public_ip
}

output "eip" {
  value = module.instance.eip
}