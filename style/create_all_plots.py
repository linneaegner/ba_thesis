import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd

# General Styling (apply once)
sns.set_theme(style="whitegrid", context="talk") # "talk" context for larger fonts

# --- Plot 1: Bar Chart for Main Effect of Time Delay ---
# This plot will correspond to "Figure X" in your thesis.
# Caption example for your document:
# "Figure X: Main effect of Time Delay on mean constructiveness scores.
# Error bars represent 95% Confidence Intervals."

# Data for Time Delay Main Effect
labels_td = ['No Time Delay', 'Time Delay']
means_td = [0.49, 0.38]
# Using your 95% CIs directly for error bars:
# No Time Delay: M=0.49, 95% CI [.45 - .53] -> Margin of error = 0.04
# Time Delay: M=0.38, 95% CI [.33 - .43] -> Margin of error = 0.05
# yerr should be [lower_error, upper_error] or a single value if symmetric.
# Here, errors are symmetric: 0.49-0.45 = 0.04; 0.53-0.49 = 0.04
# And 0.38-0.33 = 0.05; 0.43-0.38 = 0.05
ci_margins_td = [0.04, 0.05] # These are the half-widths of the CIs

plt.figure(figsize=(7, 6))
bar_plot_td = sns.barplot(x=labels_td, y=means_td,
                          palette="viridis_r", hue=labels_td, dodge=False, legend=False)

# Add error bars using the 95% CI margins
plt.errorbar(x=range(len(means_td)), y=means_td, yerr=ci_margins_td,
             fmt='none', c='black', capsize=5)

plt.title('Main Effect of Time Delay on Constructiveness', fontsize=16, pad=20)
plt.ylabel('Mean Constructiveness Score', fontsize=14)
plt.xlabel('Condition', fontsize=14)
plt.ylim(0, 0.7)

for index, value in enumerate(means_td):
    # Adjust text position slightly if needed, considering error bar cap
    plt.text(index, value + ci_margins_td[index] + 0.02, f"{value:.2f}",
             ha='center', va='bottom', fontsize=12)

sns.despine(left=True)
plt.tight_layout()
plt.savefig('figure1_time_delay_main_effect.png', dpi=300, bbox_inches='tight')
plt.savefig('figure1_time_delay_main_effect.svg', bbox_inches='tight')
plt.show()


# --- Plot 2: Interaction Plot (for Time Delay and Nudging) ---
# This plot will correspond to "Figure Y" in your thesis.
# Caption example for your document:
# "Figure Y: Interaction effect of Time Delay and Nudging on mean
# constructiveness scores. Error bars represent 95% Confidence Intervals."

# Data for the four conditions
data_interaction = {
    'Time Delay': ['No Time Delay', 'No Time Delay', 'Time Delay', 'Time Delay'],
    'Nudging': ['No Nudging', 'Nudging', 'No Nudging', 'Nudging'],
    'Mean Constructiveness': [0.51, 0.46, 0.39, 0.37],
    # SD and N are not directly used by pointplot if errorbar=('ci', 95) as it bootstraps,
    # but good to have if you wanted to calculate SE or other stats.
    'SD': [0.19, 0.23, 0.26, 0.25],
    'N': [57, 57, 62, 52]
}
df_interaction = pd.DataFrame(data_interaction)

plt.figure(figsize=(8, 6.5))
interaction_plot = sns.pointplot(x='Time Delay', y='Mean Constructiveness', hue='Nudging',
                                 data=df_interaction, palette='colorblind',
                                 markers=['o', 's'], linestyles=['-', '--'],
                                 dodge=0.1, capsize=0.1, errorbar=('ci', 95)) # 95% CI

plt.title('Constructiveness by Time Delay and Nudging', fontsize=16, pad=20) # Slightly shorter title
plt.ylabel('Mean Constructiveness Score', fontsize=14)
plt.xlabel('Time Delay Condition', fontsize=14)
plt.ylim(0, 0.7)
plt.legend(title='Nudging Condition', title_fontsize='13', fontsize='12', loc='upper right')

sns.despine()
plt.tight_layout()
plt.savefig('figure2_interaction_plot.png', dpi=300, bbox_inches='tight')
plt.savefig('figure2_interaction_plot.svg', bbox_inches='tight')
plt.show()


# --- Plot 3: Bar chart for all four conditions ---
# This plot will correspond to "Figure Z" in your thesis.
# Caption example for your document:
# "Figure Z: Mean constructiveness scores across all four experimental conditions.
# Error bars represent 95% Confidence Intervals."

# Re-using df_interaction from Plot 2
df_interaction['Condition_Combined'] = df_interaction['Time Delay'] + " / " + df_interaction['Nudging']

plt.figure(figsize=(10, 7))
bar_plot_all_four = sns.barplot(x='Condition_Combined', y='Mean Constructiveness',
                                data=df_interaction, palette="viridis",
                                hue = 'Condition_Combined', dodge=False, legend=False,
                                errorbar=('ci', 95), capsize=0.05) # 95% CI and smaller capsize

# Get the CI values if needed for text labels (Seaborn computes them)
# For simplicity, data labels here will just be the mean.
# If precise CI values on plot are needed, it's more complex as barplot doesn't return them easily.

for bar in bar_plot_all_four.patches:
    yval = bar.get_height()
    # We don't have easy access to the exact CI arm length here from barplot for text positioning
    # So, we'll position text slightly above the bar.
    plt.text(bar.get_x() + bar.get_width()/2.0, yval + 0.015,
             f"{yval:.2f}", ha='center', va='bottom', fontsize=11)

plt.title('Mean Constructiveness Across All Conditions', fontsize=16, pad=20)
plt.ylabel('Mean Constructiveness Score', fontsize=14)
plt.xlabel('Experimental Condition', fontsize=14)
plt.xticks(rotation=15, ha='right', fontsize=11)
plt.ylim(0, 0.7)

sns.despine()
plt.tight_layout()
plt.savefig('figure3_all_four_conditions_barchart.png', dpi=300, bbox_inches='tight')
plt.savefig('figure3_all_four_conditions_barchart.svg', bbox_inches='tight')
plt.show()

# --- Plot 4: Bar Chart for Main Effect of Nudging ---
# (This is the code previously generated for the Nudging main effect)
# This plot will correspond to "Figure W" in your thesis.
# Caption example for your document:
# "Figure W: Main effect of Nudging on mean constructiveness scores.
# Error bars represent 95% Confidence Intervals."

labels_nudging = ['No Nudging', 'Nudging']
means_nudging = [0.45, 0.42]
# Using your 95% CIs directly for error bars:
# No Nudging: M=0.45, 95% CI [.41 - .49] -> Margin of error = 0.04
# Nudging: M=0.42, 95% CI [.37 - .46] -> Margin of error = 0.04 (0.42-0.37=0.05, 0.46-0.42=0.04, take avg or larger if not symmetric, here 0.045 is mid, so M+/-0.045. Let's assume 0.04 for simplicity or use asymmetric if necessary)
# For simplicity, using symmetric margin of error, but check your exact CI width
# No Nudging: 0.45-0.41 = 0.04; 0.49-0.45 = 0.04. Symmetric. Margin = 0.04
# Nudging: 0.42-0.37 = 0.05; 0.46-0.42 = 0.04. Slightly asymmetric.
#   Lower error = 0.05, Upper error = 0.04. plt.errorbar can take [lower, upper]
ci_lower_nudging = [0.04, 0.05] # M - lower_bound
ci_upper_nudging = [0.04, 0.04] # upper_bound - M
ci_margins_nudging = [ci_lower_nudging, ci_upper_nudging] # For yerr in errorbar

plt.figure(figsize=(7, 6))
bar_plot_nudging = sns.barplot(x=labels_nudging, y=means_nudging,
                             palette="pastel", hue=labels_nudging, dodge=False, legend=False)

# Add error bars using the 95% CI margins
plt.errorbar(x=range(len(means_nudging)), y=means_nudging, yerr=ci_margins_nudging,
             fmt='none', c='black', capsize=5)

plt.title('Main Effect of Nudging on Constructiveness', fontsize=16, pad=20)
plt.ylabel('Mean Constructiveness Score', fontsize=14)
plt.xlabel('Condition', fontsize=14)
plt.ylim(0, 0.7)

for index, value in enumerate(means_nudging):
    # Positioning text using the upper error margin for consistency
    plt.text(index, value + ci_margins_nudging[1][index] + 0.02, f"{value:.2f}",
             ha='center', va='bottom', fontsize=12)

sns.despine(left=True)
plt.tight_layout()
plt.savefig('figure4_nudging_main_effect.png', dpi=300, bbox_inches='tight')
plt.savefig('figure4_nudging_main_effect.svg', bbox_inches='tight')
plt.show()