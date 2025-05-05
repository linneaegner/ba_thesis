import pandas as pd
import json
import io
import os

# Ange namnet på din sparade original JSON-fil här
original_json_filename = 'original_data.json' # Ändra om du döpte filen annorlunda

# Kontrollera om filen finns
if not os.path.exists(original_json_filename):
    print(f"Fel: Filen '{original_json_filename}' hittades inte i samma mapp som skriptet.")
    print("Se till att du har sparat den nedladdade JSON-filen med detta namn i samma mapp.")
else:
    try:
        # Läs in den lokala JSON-filen
        with open(original_json_filename, 'r', encoding='utf-8') as f:
            json_data = json.load(f)

        # Ladda data till DataFrame
        df = pd.DataFrame(json_data)

        # --- Data Processing ---
        json_cols = ['questionnaire', 'experiment', 'feedback']
        final_dfs = []

        # Behåll originalkolumner utom de som ska plattas ut
        original_cols_to_keep = [col for col in df.columns if col not in json_cols]
        final_dfs.append(df[original_cols_to_keep].copy())

        # Bearbeta varje JSON-kolumn
        for col in json_cols:
            # Funktion för säker JSON-parsning
            def safe_json_loads(cell):
                if pd.isna(cell) or cell == '{}':
                    return {} # Tom dict för null eller tom JSON-sträng
                try:
                    # Säkerställ att det behandlas som sträng innan parsning
                    return json.loads(str(cell))
                except (json.JSONDecodeError, TypeError):
                     # Hantera fall där innehållet redan kan vara parsat eller ogiltigt
                    if isinstance(cell, dict):
                        return cell # Redan en dict
                    print(f"Varning: Kunde inte parsa JSON i kolumn '{col}', rad-index okänt. Innehåll: {cell}")
                    return {} # Tom dict om parsning misslyckas

            # Applicera säker parsning och normalisera
            parsed_data = [safe_json_loads(cell) for cell in df[col]]
            flattened_df = pd.json_normalize(parsed_data)

            # Lägg till prefix för att undvika kolumnnamnskollisioner
            flattened_df = flattened_df.add_prefix(f"{col}_")
            final_dfs.append(flattened_df)

        # Slå ihop alla delar: originalkolumner + utplattade kolumner från varje JSON-kolumn
        df_final = pd.concat(final_dfs, axis=1)

        # --- Exportera till filer ---

        # Exportera till CSV
        csv_filename = 'plattad_data.csv'
        df_final.to_csv(csv_filename, index=False, encoding='utf-8-sig') # utf-8-sig för bättre Excel-kompatibilitet
        print(f"'{csv_filename}' har skapats med {len(df_final)} rader.")

        # Exportera till JSON (records format)
        json_filename = 'plattad_data.json'
        # Använd force_ascii=False för att hantera specialtecken korrekt
        df_final.to_json(json_filename, orient='records', indent=2, force_ascii=False, default_handler=str) # default_handler=str för säkerhets skull
        print(f"'{json_filename}' har skapats med {len(df_final)} rader.")

        print("\nBearbetningen är klar!")

    except FileNotFoundError:
        print(f"Fel: Kunde inte hitta filen '{original_json_filename}'.")
        print("Se till att filen ligger i samma mapp som Python-skriptet och har rätt namn.")
    except Exception as e:
        print(f"Ett oväntat fel uppstod: {e}")