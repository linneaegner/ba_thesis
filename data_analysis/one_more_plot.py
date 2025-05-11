import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd

# General Styling (apply once if not already done in your script)
sns.set_theme(style="whitegrid", context="talk")

# --- Bar chart for all four conditions (Your PDF's Figure 1) ---
# With manually calculated and plotted 95% CI error bars.
# Caption for your document:
# "Figure 1. Mean constructiveness scores across the four experimental conditions.
# Error bars represent 95% Confidence Intervals."

# Data for the four conditions
conditions_labels = [
    'No Time Delay / No Nudging',
    'No Time Delay / Nudging',
    'Time Delay / No Nudging',
    'Time Delay / Nudging'
]
means = np.array([0.51, 0.46, 0.39, 0.37])
sds = np.array([0.19, 0.23, 0.26, 0.25])
Ns = np.array([57, 57, 62, 52])

# Calculate Standard Error (SE)
standard_errors = sds / np.sqrt(Ns)

# Calculate 95% Confidence Interval margin (approximately 1.96 * SE)
# For more precision with smaller N, you could use a t-distribution critical value
# instead of 1.96, but 1.96 is a common and generally good approximation.
ci_margins = 1.96 * standard_errors

# Create a DataFrame for Seaborn (optional, but often convenient)
df_plot_data = pd.DataFrame({
    'Condition': conditions_labels,
    'Mean_Constructiveness': means,
    'CI_Margin': ci_margins # Store calculated CI margin
})

plt.figure(figsize=(12, 7)) # Increased width slightly for longer labels

# Create the bar plot using Seaborn (without asking it to draw error bars itself)
bar_plot = sns.barplot(
    x='Condition',
    y='Mean_Constructiveness',
    data=df_plot_data,
    palette="viridis" # Using the same palette as your PDF image
    # No hue needed here as x-axis uniquely defines bars
)

# Add the error bars manually using plt.errorbar
# Get the x-coordinates of the bars that Seaborn plotted
x_coords = [p.get_x() + p.get_width() / 2. for p in bar_plot.patches]

plt.errorbar(
    x=x_coords,
    y=means,
    yerr=ci_margins, # Use the calculated 95% CI margins
    fmt='none',       # No line connecting error bar points
    c='black',        # Color of the error bars
    capsize=5         # Size of the caps on the error bars
)

# Add data labels on top of bars (positioned above the error bar)
for i in range(len(conditions_labels)):
    plt.text(
        x_coords[i],
        means[i] + ci_margins[i] + 0.015, # Position text above the error bar
        f"{means[i]:.2f}",
        ha='center',
        va='bottom',
        fontsize=11
    )

plt.title('Mean Constructiveness Across All Conditions', fontsize=16, pad=20)
plt.ylabel('Mean Constructiveness Score', fontsize=14)
plt.xlabel('Experimental Condition', fontsize=14)
plt.xticks(rotation=15, ha='right', fontsize=11) # Rotate labels for better fit
plt.ylim(0, 0.75) # Ensure space for error bars and labels

sns.despine()
plt.tight_layout()

# Ensure you use the correct figure number in the filename
plt.savefig('figure_all_four_conditions_barchart_with_errors.png', dpi=300, bbox_inches='tight')
plt.savefig('figure_all_four_conditions_barchart_with_errors.svg', dpi=300, bbox_inches='tight')
plt.show()