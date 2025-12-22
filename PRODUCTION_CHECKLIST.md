# Production Readiness Checklist

Use this checklist before deploying to production.

## Environment Configuration

- [ ] All environment variables set in production environment
- [ ] `NODE_ENV=production` is set
- [ ] `JWT_SECRET` is strong (32+ characters, random)
- [ ] `DATABASE_URL` points to production database
- [ ] `FRONTEND_URL` matches production domain
- [ ] Email service credentials configured
- [ ] Stripe keys configured (if using payments)
- [ ] Rate limiting values appropriate for production

## Security

- [ ] All default passwords changed
- [ ] JWT_SECRET is unique and secure
- [ ] Database uses SSL/TLS connections
- [ ] CORS configured for production domain only
- [ ] Rate limiting enabled and configured
- [ ] Helmet security headers enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] CSRF protection (if applicable)
- [ ] Audit logging enabled
- [ ] Error messages don't expose sensitive information

## Database

- [ ] Production database created
- [ ] Migrations run successfully
- [ ] Database backups configured
- [ ] Backup restore tested
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Database credentials secure

## Application

- [ ] Application builds successfully (`npm run build`)
- [ ] All tests pass
- [ ] No console errors in production build
- [ ] TypeScript compilation successful
- [ ] Linting passes
- [ ] Health check endpoint working (`/api/health`)
- [ ] Error handling tested
- [ ] Logging configured
- [ ] Performance tested under load

## Infrastructure

- [ ] Server resources adequate (CPU, RAM, disk)
- [ ] Reverse proxy configured (Nginx/Apache)
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Monitoring set up
- [ ] Alerting configured
- [ ] Log rotation configured
- [ ] Process manager configured (PM2/systemd)

## Testing

- [ ] Authentication flow tested
- [ ] Authorization tested (role-based access)
- [ ] API endpoints tested
- [ ] Database operations tested
- [ ] Email sending tested
- [ ] Payment processing tested (if applicable)
- [ ] Error scenarios tested
- [ ] Load testing performed

## Documentation

- [ ] README.md updated
- [ ] API documentation complete
- [ ] Deployment guide reviewed
- [ ] Environment variables documented
- [ ] Runbook created for operations team

## Monitoring & Maintenance

- [ ] Application monitoring set up
- [ ] Database monitoring set up
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Backup verification scheduled
- [ ] Update procedures documented

## Legal & Compliance

- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] GDPR compliance (if applicable)
- [ ] Data retention policies set
- [ ] Cookie consent implemented (if applicable)

## Post-Deployment

- [ ] Smoke tests passed
- [ ] Monitoring dashboards reviewed
- [ ] Error rates checked
- [ ] Performance metrics reviewed
- [ ] Team notified of deployment
- [ ] Rollback plan ready

## Sign-off

- [ ] Reviewed by: _________________ Date: _______
- [ ] Approved by: _________________ Date: _______
- [ ] Deployed by: _________________ Date: _______


