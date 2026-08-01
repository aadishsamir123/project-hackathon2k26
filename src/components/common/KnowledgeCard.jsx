import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function KnowledgeCard({ title, badge, summary, steps, formula, policyNote }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card variant="outlined" sx={{ borderRadius: 7, p: 1, bgcolor: 'var(--theme-panel, #ffffff)', borderColor: 'var(--theme-border, #e1e4e1)' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 4,
                bgcolor: 'var(--theme-border, #e6f4ea)',
                color: 'var(--theme-primary, #006d44)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
              }}
            >
              ℹ️
            </Box>
            <Box>
              <Chip
                label={badge || 'M3 User Guide'}
                size="small"
                sx={{
                  bgcolor: 'var(--theme-border, #e6f4ea)',
                  color: 'var(--theme-primary, #004026)',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  height: 22,
                  mb: 0.5,
                }}
              />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'var(--theme-text, #191c1a)', lineHeight: 1.2 }}>
                {title}
              </Typography>
            </Box>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => setIsOpen(!isOpen)}
            endIcon={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            sx={{
              borderRadius: 100,
              color: 'var(--theme-text-muted, #404943)',
              borderColor: 'var(--theme-border, #c0c9c2)',
              fontSize: '0.75rem',
              px: 2,
              py: 0.5,
            }}
          >
            {isOpen ? 'Hide Guide' : 'Show Guide'}
          </Button>
        </Box>

        {/* Collapsible Content */}
        <Collapse in={isOpen}>
          <Box sx={{ mt: 2.5, pt: 2, borderTop: '1px solid var(--theme-border, #e1e4e1)', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'var(--theme-text-muted, #404943)', lineHeight: 1.6 }}>
              {summary}
            </Typography>

            {steps && steps.length > 0 && (
              <Box sx={{ bgcolor: 'var(--theme-bg, #f2f4f2)', p: 2, borderRadius: 4, border: '1px solid var(--theme-border, #e1e4e1)' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--theme-text, #191c1a)', display: 'block', mb: 1 }}>
                  Step-by-Step Instructions:
                </Typography>
                <ol style={{ margin: 0, paddingLeft: 18, fontSize: '0.8rem', color: 'var(--theme-text-muted, #404943)' }}>
                  {steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
                  ))}
                </ol>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
              {formula && (
                <Box sx={{ bgcolor: 'var(--theme-border, #e6f4ea)', p: 2, borderRadius: 4, border: '1px solid var(--theme-border, #bce3ca)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--theme-primary, #004026)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    🧮 Calculation Basis
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--theme-primary, #006d44)', fontWeight: 600, display: 'block', lineHeight: 1.4 }}>
                    {formula}
                  </Typography>
                </Box>
              )}

              {policyNote && (
                <Box sx={{ bgcolor: 'var(--theme-bg, #f2f4f2)', p: 2, borderRadius: 4, border: '1px solid var(--theme-border, #e1e4e1)' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'var(--theme-text, #191c1a)', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    🇸🇬 Singapore Policy Baseline
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--theme-text-muted, #404943)', display: 'block', lineHeight: 1.4 }}>
                    {policyNote}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}
