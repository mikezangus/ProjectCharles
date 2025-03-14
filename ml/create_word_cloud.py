import matplotlib.pyplot as plt
from wordcloud import WordCloud


def create_wordcloud(words: list[str], vote: str):
    word_cloud = WordCloud(width=800, height=400).generate(" ".join(words))
    plt.figure(figsize=(10, 5))
    plt.imshow(word_cloud, interpolation="bilinear")
    plt.axis("off")
    plt.title(f"{vote} Words")
    plt.show()
