export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  rules: {
    // Tailwind's `@apply` takes utility class names, which stylelint can't validate.
    'at-rule-prelude-no-invalid': [true, { ignoreAtRules: ['apply'] }],
  },
};
