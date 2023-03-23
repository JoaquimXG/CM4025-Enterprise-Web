
##### INSTANCE #####

module "instance" {
  source = "../../modules/ec2-instance"

  tags               = var.instance_tags
  ami_id             = var.instance_ami_id
  instance_type      = var.instance_type
  hibernation        = var.instance_hibernation
  private_key_name   = var.instance_private_key_name
  az                 = var.instance_az
  vpc_id             = var.instance_vpc_id
  subnet_id          = var.instance_subnet_id
  security_group_ids = var.instance_security_group_ids
  create_eip         = var.instance_create_eip
}

##### INSTANCE ROUTE53 RECORD #####
module "instance_record" {
  source = "../../modules/route53-record"

  domain = var.domain
  subdomain = var.subdomain
  type   = "A"
  ttl    = "60"
  target = module.instance.public_ip
}