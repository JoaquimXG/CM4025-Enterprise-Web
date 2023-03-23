resource "aws_route53_record" "record" {
  zone_id = data.aws_route53_zone.domain.zone_id
  name    = local.full_domain
  type    = var.type
  ttl     = var.ttl
  records = [var.target]
}
