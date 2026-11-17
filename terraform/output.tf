output "instance_public_ip" {
  value = aws_instance.webtext.public_ip
}

output "ssh_command" {
  value = "ssh -i ~/.ssh/id_rsa ubuntu@${aws_instance.webtext.public_ip}"
}

output "application_url" {
  value = "http://${aws_instance.webtext.public_ip}:8081"
}